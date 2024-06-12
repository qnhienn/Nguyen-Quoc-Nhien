const BLOCKCHAIN_PRIORITY_DIST = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;
const OTHER_BLOCKCHAIN_PRIORITY = -99;

type BlockchainType = keyof typeof BLOCKCHAIN_PRIORITY_DIST;
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: BlockchainType;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Since `getPriority` is a dependency of useMemo, it should be wrapped by a `useCallback` hook
  // to reduce redundant re-calculator when component is re-render
  const getPriority = useCallback((blockchain: BlockchainType): number => {
    return BLOCKCHAIN_PRIORITY_DIST[blockchain] ?? OTHER_BLOCKCHAIN_PRIORITY;
  }, []);

  const formattedBalances = useMemo(() => {
    const items: FormattedWalletBalance[] = [];

    // Combine `map` and `filter` to a `forEach` to reduce loop
    balances.forEach((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > OTHER_BLOCKCHAIN_PRIORITY && balance.amount <= 0) {
        items.push({
          ...balance,
          formatted: balance.amount.toFixed(),
        });
      }
    });

    items.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);

      return rightPriority - leftPriority;
    });

    return items;
  }, [balances, getPriority]);

  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
