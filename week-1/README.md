# 开发环境搭建

## 依赖安装

推荐使用 asdf 安装, 参考官方文章 [Setting up your development environment](https://docs.starknet.io/build/quickstart/environment-setup)

```bash
scarb --version
snforge --version
sncast --version
starknet-devnet --version
```

## 创建钱包

```bash
sncast account create --network sepolia

# --name account

# --type oz
# --type ready
# --type braavos

sncast account list
```

## 获取测试代币

https://starknet-faucet.vercel.app/

STRK: [0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d](https://sepolia.voyager.online/token/0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d)

## 查询余额

```bash
sncast call --contract-address 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d --function balance_of --network sepolia --arguments <address>
```

## 部署钱包

```bash
sncast account deploy --network sepolia --name account-1
```

## 发起转账

```bash
sncast --account account-1 invoke --network sepolia --contract-address 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d --function transfer --arguments '<account-2>,1'
```