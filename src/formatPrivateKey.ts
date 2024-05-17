export const formatPrivateKey = (key: string): string => {
  return key.replaceAll('\\n', '\n')
}
