/*
  Root layout for the admin panel only.

  This app has no app/layout.tsx — app/[locale]/layout.tsx is the root layout
  for the public site, which is what lets the (payload) route group declare a
  second, separate root here. The admin therefore renders none of the site's
  chrome, fonts or theme, and nothing in this file can affect what a visitor
  sees.
*/
import type { ServerFunctionClient } from 'payload';
import config from '@payload-config';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

import { importMap } from './admin/importMap.js';

import '@payloadcms/next/css';

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
