import { Button } from './ui/Button';

function GoogleLogo() {
  return (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-base font-black text-[#4285f4]">
      G
    </span>
  );
}

export function GoogleSignInButton({
  isLoading,
  onClick,
  label = 'Entrar com Google',
}: {
  isLoading?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button type="button" size="lg" className="w-full" isLoading={isLoading} leftIcon={<GoogleLogo />} onClick={onClick}>
      {label}
    </Button>
  );
}
