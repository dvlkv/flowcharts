require('./index.less');

export * from '../algorithmer-navigation/Redirect';

type FalsyValue = null | undefined | false;
export const cx = (...args: (string | FalsyValue)[]) => {
  return args.filter(a => !!a).join(' ');
}