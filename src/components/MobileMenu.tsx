import type {ReactNode} from 'react';
import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';

export default function MobileMenu({base, path, children}: {base: string, path: string, children: ReactNode}) {
  function urlMatch(url: string) {
    if (url !== path) return 'block py-2';
    return 'font-bold block py-2';
  }

  const pages = [
    {
      url: `${base}`,
      name: 'About'
    },
    {
      url: `${base}projects/1/`,
      name: 'Projects'
    },
    {
      url: `${base}contributions/1/`,
      name: 'Contributions'
    }
  ];

  return (
    <MenuTrigger>
      <div className="lg:hidden grow flex justify-end text-2xl pr-2">
        <Button id="menu-button" className="px-3">
          {children}
          <span className="sr-only">Menu</span>
        </Button>
        <Popover>
          <Menu className="bg-primary-950 text-primary-200 text-xl px-4">
            {pages.map((page, index) => (
              <MenuItem href={page.url} className={urlMatch(page.url)} key={`page${index}`}>{page.name}</MenuItem>
            ))}
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
