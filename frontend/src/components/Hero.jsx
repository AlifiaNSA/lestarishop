import React from 'react'
import { BsFire } from 'react-icons/bs'
import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[667px] w-full mb-10 relative flex flex-col justify-center'>
      <div className='max-w-[777px]'>
        <h5 className='flex items-baseline gap-x-2 uppercase text-secondary medium-18'>
          BEST COLLECTION <BsFire />
        </h5>
        <h1 className='h1 font-[500] capitalize max-w-[722px]'>
          Selamat Datang Di Lestari
          <br /> Store
        </h1>
        <div className='flex mt-6'>
          <Link
            to='/collection'
            className='bg-white text-xs font-medium capitalize pl-5 rounded-full flexCenter gap-x-2 group shadow-md'
          >
            Check Our Collection
            <FaArrowRight className='bg-secondary text-white rounded-full h-11 w-11 p-3 m-[3px] border border-white group-hover:-rotate-[20deg] transition-all duration-500' />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
