import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';

export default function MobileMenu({base, path}: {base: string, path: string}) {
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
          <span className="iconify ic--baseline-menu block" aria-hidden="true"></span>
          <span className="sr-only">Menu</span>
        </Button>
        <Popover>
          <Menu className="bg-big-stone-950 text-big-stone-100 text-xl px-4">
            {pages.map((page, index) => (
              <MenuItem href={page.url} className={urlMatch(page.url)} key={`page${index}`}>{page.name}</MenuItem>
            ))}
            <MenuItem
              href="https://github.com/dan-mba"
              target="_blank" rel="noreferrer noopener"
              className="block py-2"
            >GitHub <span className="iconify fa6-brands--github w-6 h-6 align-sub" aria-hidden="true"></span></MenuItem>
            <MenuItem
              href="https://www.linkedin.com/in/danburkhardt/"
              target="_blank" rel="noreferrer noopener"
              className="block py-2"
            >LinkedIn <span className="iconify fa6-brands--linkedin w-6 h-6 align-sub" aria-hidden="true"></span></MenuItem>
          </Menu>
        </Popover>
      </div>
    </MenuTrigger>
  )
}
