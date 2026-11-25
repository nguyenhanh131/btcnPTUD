const P = { plus: 'M12 5v14M5 12h14', search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5', edit: 'M4 20h4L19 9l-4-4L4 16v4z', del: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3', ok: 'M5 12l5 5 9-10',
  today: 'M3 7a3 3 0 013-3h12a3 3 0 013 3v11a3 3 0 01-3 3H6a3 3 0 01-3-3zM8 2v4M16 2v4M3 10h18', list: 'M9 6h12M9 12h12M9 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01', stats: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }
export default function Icon({ name }: { name: keyof typeof P }) { return <svg className="i" viewBox="0 0 24 24"><path d={P[name]} /></svg> }
