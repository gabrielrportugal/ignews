import Link, { LinkProps } from 'next/link';
import { ReactElement, cloneElement } from 'react';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...props }:ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === props.href ? activeClassName : '';

  return (
    <Link {...props}>
      {/* Clonar um elemento React e adiciona uma propriedade desejada */}
      {cloneElement(children, {className})}
    </Link>
  )
}