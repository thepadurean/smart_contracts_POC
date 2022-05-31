import React from 'react'
import Button from '@mui/material/Button';
import { useState } from 'react';
import TransactionModal from './TransactionModal'


export default function Parent() {
  const [data, setData] = useState('');
  
  const parentToChild = () => {
    setData("This is data from Parent Component to the Child Component.");
  }
  return (
    <div>
      <TransactionModal parentToChild={data}/>
      
      <div className="child">
        <Button primary onClick={() => parentToChild()}>Click Parent To Child</Button>
      </div>
    </div>
  )
}