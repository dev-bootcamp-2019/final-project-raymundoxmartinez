var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions')

contract('SupplyChain', function (accounts) {

        const owner = accounts[0]
        const alice = accounts[1]
        const bob = accounts[2]
        const emptyAddress = '0x0000000000000000000000000000000000000000'
        var sku
        const price = "1000"
        
        /**checks to see whether one can successfully add an item to the contract */
        it("should add an item with the provided name, price, and image", async () => {
                const supplyChain = await SupplyChain.deployed()
                var eventEmitted = false
                const name = "book"
                const image = "image"
                const tx = await supplyChain.addItem(name, price, image, { from: alice })
                if (tx.logs[0].event === "ForSale") {
                        sku = tx.logs[0].args.sku.toString(10)
                        eventEmitted = true
                }

                const result = await supplyChain.fetchItem.call(sku)

                assert.equal(result[0], name, 'the name of the last added item does not match the expected value')
                assert.equal(result[2].toString(10), price, 'the price of the last added item does not match the expected value')
                assert.equal(result[3].toString(10), 0, 'the state of the item should be "For Sale", which should be declared first in the State Enum')
                assert.equal(result[4], alice, 'the address adding the item should be listed as the seller')
                assert.equal(result[5], emptyAddress, 'the buyer address should be set to 0 when an item is added')
                assert.equal(eventEmitted, true, 'adding an item should emit a For Sale event')
        })

        /**verifies that one can successfully buy an item stored in the contract. */
        it("should allow someone to purchase an item", async () => {
                const supplyChain = await SupplyChain.deployed()

                var eventEmitted = false

                const amount = "2000"

                var aliceBalanceBefore = await web3.eth.getBalance(alice)
                var bobBalanceBefore = await web3.eth.getBalance(bob)

                const tx = await supplyChain.buyItem(sku, { from: bob, value: amount })
                if (tx.logs[0].event === "Sold") {
                        sku = tx.logs[0].args.sku.toString(10)
                        eventEmitted = true
                }

                var aliceBalanceAfter = await web3.eth.getBalance(alice)
                var bobBalanceAfter = await web3.eth.getBalance(bob)

                const result = await supplyChain.fetchItem.call(sku)

                assert.equal(result[3].toString(10), 1, 'the state of the item should be "Sold", which should be declared second in the State Enum')
                assert.equal(result[5], bob, 'the buyer address should be set bob when he purchases an item')
                assert.equal(eventEmitted, true, 'adding an item should emit a Sold event')
                assert.equal(parseInt(aliceBalanceAfter), parseInt(aliceBalanceBefore, 10) + parseInt(price, 10), "alice's balance should be increased by the price of the item")
                assert.isBelow(parseInt(bobBalanceAfter), parseInt(bobBalanceBefore, 10) - parseInt(price, 10), "bob's balance should be reduced by more than the price of the item (including gas costs)")
        })

        /**verifies that a transaction is reverted when a user attemps to buy an item at a lower 
         * price than advertised
         */
        it("should not allow buyers to buy item with a value less than the price", async () => {
                const supplyChain = await SupplyChain.deployed()
                const amount = "500"
                const name = "book"
                const image = "image"
                var eventEmitted = false
                const tx = await supplyChain.addItem(name, price, image, { from: alice })
                if (tx.logs[0].event === "ForSale") {
                        sku = tx.logs[0].args.sku.toString(10)
                        eventEmitted = true
                }
                await truffleAssert.reverts(supplyChain.buyItem(sku, { from: bob, value: amount }))
        })

        /**verifies that once the circuit breaker is turned on any following 
         * transaction will not go through */
        it("should cancel transactions when circuit breaker is on", async () => {
                const supplyChain = await SupplyChain.deployed()
                const amount = "2000"
                await supplyChain.circuitBreaker()
                await truffleAssert.reverts(
                        supplyChain.buyItem(sku, { from: bob, value: amount }), 
                        null,
                        null,
                        'this method should not pass since the circuit breaker as been turned on.'
                        )
        })

        /**verifies that once the circuit breaker has been turned off the contract's methods 
         * can once again be executed */
        it("should allow transactions to continue when circuit breaker is turned off", async () => {
                const supplyChain = await SupplyChain.deployed()
                const amount = "2000"
                await supplyChain.circuitBreaker()
                await truffleAssert.passes(
                        supplyChain.buyItem(sku, { from: bob, value: amount }),
                        'this method should pass after the circuit breaker has been turned off.'
                )
        })

});