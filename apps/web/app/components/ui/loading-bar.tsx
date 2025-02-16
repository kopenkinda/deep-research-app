export const LoadingBar = () => {
  return (
    <div className="w-full h-1 bg-gray-200 overflow-hidden relative">
      <div className="w-1/4 h-full bg-primary absolute animate-indeterminate-loader" />
    </div>
  );
};
