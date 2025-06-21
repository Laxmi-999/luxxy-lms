'use client';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {  getSingleBook } from '@/Redux/slices/bookSlice'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookDetails = () => {
    const {selectedBook} = useSelector((state) => state.books)
    const dispatch = useDispatch();
    const {id} = useParams();


   useEffect(() => {
  if (id) {
    dispatch(getSingleBook(id));
  }
}, [dispatch, id]);
console.log('selected book is', selectedBook);

if (!selectedBook) {
  return <p className="p-4">Loading book details...</p>;
}


  return (
    <div>
        <Link href='/member/all-book'>
          <Button className='mt-5 mx-auto'>Back</Button>
        </Link>
        <Card>
            <div className='justify-center align-center items-center mx-auto'>
                <img src = {selectedBook.coverImage}  className='h-[30vh] '/>
                <h1>{selectedBook.title}</h1>
                <p>By:{selectedBook.author}</p>
                <p>isbn:{selectedBook.isbn}</p>
                <p>total copies:{selectedBook.totalCopies}</p>
                <p>available copies:{selectedBook.availableCopies}</p>
            </div>
        </Card>
    </div>
  )
}

export default BookDetails