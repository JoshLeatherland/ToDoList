export const copyToClipboard = (shareUrl) => {
  navigator.clipboard.writeText(shareUrl).then(() => {});
};
