export const Title = () => {
  return (
    <p className="w-full flex flex-col items-start justify-start gap-1 sm:gap-2">
      <span className="text-xs sm:text-sm font-normal leading-tight text-muted-foreground">Bem vindo(a) ao</span>
      <span className="text-xl sm:text-2xl md:text-3xl">
        <strong className="font-bold uppercase font-title">Waiter</strong>
        <span className="pl-0.5 font-extralight uppercase">App</span>
      </span>
    </p>
  );
};
