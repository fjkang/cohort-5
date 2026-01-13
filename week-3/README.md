## Step 0

使用 scarb 从模版创建合约项目

## Step 1

编写 Counter 合约，并实现以下方法

```
#[starknet::interface]
pub trait ICounter<TContractState> {
    fn get(self: @TContractState) -> u32;
    fn inc(ref self: TContractState);
}
```

## Step 2

为合约编写单元测试

## Step 3

为合约增加 constructor 函数，指定计数器初始值

提示：https://www.starknet.io/cairo-book/ch101-02-contract-functions.html#1-constructors

## Step 4

当计数器改变时，创建一个包含当前值的事件

提示：https://www.starknet.io/cairo-book/ch101-03-contract-events.html

## Step 5

使用 `sncast declare` 与 `sncast deploy` 将合约部署至 Sepolia 测试网
```bash
sncast declare --contract-name Counter --network sepolia
   Compiling counter_0xdb v0.1.0 
    Finished `release` profile target(s) in 1 second
Success: Declaration completed

Class Hash:       0x510677cfe1b9ab7fbbcb4844d175d6b9d5ee59e95f0cf88205af3008636d964
Transaction Hash: 0x15fee331fae9776941f2d187a937104fc0a99f1091716f8296b6a7232f8983b

To see declaration details, visit:
class: https://sepolia.starkscan.co/class/0x0510677cfe1b9ab7fbbcb4844d175d6b9d5ee59e95f0cf88205af3008636d964
transaction: https://sepolia.starkscan.co/tx/0x015fee331fae9776941f2d187a937104fc0a99f1091716f8296b6a7232f8983b

To deploy a contract of this class, replace the placeholders in `--arguments` with your actual values, then run:
sncast --account account-1 deploy --class-hash 0x510677cfe1b9ab7fbbcb4844d175d6b9d5ee59e95f0cf88205af3008636d964 --arguments '<inital_value: u32>' --network sepolia
```

```bash
sncast --account account-1 deploy --class-hash 0x510677cfe1b9ab7fbbcb4844d175d6b9d5ee59e95f0cf88205af3008636d964 --arguments 219 --network sepolia

Success: Deployment completed

Contract Address: 0x06ef65e8ed30a7eacf2264a0723087837d7b40f4fc18b15a9fc81c754acae415
Transaction Hash: 0x02bbc7d0d4f803b1917467a79b550fc95557e6283c99158d70a105d16093a123

To see deployment details, visit:
contract: https://sepolia.starkscan.co/contract/0x06ef65e8ed30a7eacf2264a0723087837d7b40f4fc18b15a9fc81c754acae415
transaction: https://sepolia.starkscan.co/tx/0x02bbc7d0d4f803b1917467a79b550fc95557e6283c99158d70a105d16093a123
```


并使用 `sncast call` 与 `sncast invoke` 测试 `get` 和 `inc` 方法
```bash
sncast call --contract-address 0x06ef65e8ed30a7eacf2264a0723087837d7b40f4fc18b15a9fc81c754acae415 --function get --network sepolia
Success: Call completed

Response:     219_u32
Response Raw: [0xdb]
```
```bash
sncast invoke --contract-address 0x06ef65e8ed30a7eacf2264a0723087837d7b40f4fc18b15a9fc81c754acae415 --function inc --network sepolia 
Success: Invoke completed

Transaction Hash: 0x07fa283eb3bef98ae06a941ce126fdd1a841f72e1b7673da9436c445ea027dd1

To see invocation details, visit:
transaction: https://sepolia.starkscan.co/tx/0x07fa283eb3bef98ae06a941ce126fdd1a841f72e1b7673da9436c445ea027dd1
```