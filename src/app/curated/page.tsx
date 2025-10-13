import { redirect } from 'next/navigation';

export default function CuratedRedirect() {
  redirect('/cocktails');
}