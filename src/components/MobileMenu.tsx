import type {ReactNode} from 'react';
import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';

export default function MobileMenu({base, path, children}: {base: string, path: string, children: ReactNode}) {
  function urlMatch(url: string) {
    if (url !== path) return 'block py-2';
    return 'font-bold block py-2';
  }

  return (
    <MenuTrigger>
      <div className="lg:hidden grow flex justify-end text-2xl pr-2">
        <Button id="menu-button" aria-label="Menu" className="px-3">{children}</Button>
        <Popover>
          <Menu className="bg-primary-950 text-primary-200 text-xl px-4">
            <MenuItem href={`${base}`} className={urlMatch(`${base}`)}>About</MenuItem>
            <MenuItem href={`${base}projects/1/`} className={urlMatch(`${base}projects/1/`)}>Projects</MenuItem>
            <MenuItem href={`${base}contributions/1/`} className={urlMatch(`${base}contributions/1/`)}>Contributions</MenuItem>
            <MenuItem
              href="https://github.com/dan-mba"
              target="_blank" rel="noreferrer noopener"
              className="block py-2"
            >GitHub</MenuItem>
            <MenuItem
              href="https://www.linkedin.com/in/danburkhardt/"
              target="_blank" rel="noreferrer noopener"
              className="block py-2"
            >LinkedIn</MenuItem>
          </Menu>
        </Popover>
      </div>
    </MenuTrigger>
  )
}
