export const LoadingBar = () => {
  return (
    <div className="w-full h-1 bg-muted overflow-hidden relative">
      <div className="w-1/4 h-full bg-muted-foreground absolute animate-indeterminate-loader" />
    </div>
  );
};
