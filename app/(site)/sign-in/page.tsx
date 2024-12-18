import React from 'react';
import Image from 'next/image';
import AuthForm from '../(components)/AuthForm';

export default function Home() {
  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  );
}
