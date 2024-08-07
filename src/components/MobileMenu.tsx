import type {ReactNode} from 'react';
import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';



export default function MobileMenu({base, path, children}: {base: string, path: string, children: ReactNode}) {
  
  return (
    <MenuTrigger>
      <div className="lg:hidden grow flex justify-end text-2xl pr-2">
        <Button aria-label="Menu" className="px-3">{children}</Button>
        <Popover>
          <Menu>
            <MenuItem onAction={() => alert('open')}>Open</MenuItem>
            <MenuItem onAction={() => alert('rename')}>Rename…</MenuItem>
            <MenuItem onAction={() => alert('duplicate')}>Duplicate</MenuItem>
            <MenuItem onAction={() => alert('share')}>Share…</MenuItem>
            <MenuItem onAction={() => alert('delete')}>Delete…</MenuItem>
          </Menu>
        </Popover>
      </div>
    </MenuTrigger>
  )
}
