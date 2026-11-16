import React from 'react';
import { Header, Footer } from '../components/Chrome';

export default function Layout({ children }) {
  return <><Header /><main>{children}</main><Footer /></>;
}
