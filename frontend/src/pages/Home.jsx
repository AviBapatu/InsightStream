import React from 'react';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import NewsGrid from '../components/NewsGrid';

const Home = () => {
  return <>
    <Navbar />
    <CategoryBar />
    <NewsGrid />
  </>
}

export default Home