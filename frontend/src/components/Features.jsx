import React from 'react'
import img1 from '../assets/features/feature1.png'
import img2 from '../assets/features/feature2.png'

const Features = () => {
  return (
    <section className='max-padd-container pt-14 pb-20'>
      {/* container */}
      <div className='grid grid-cols-1 xl:grid-cols-[1.5fr_2fr] gap-6 gap-y-12 rounded-xl'>
        <div className='flexCenter gap-x-10'>
          <div>
            <img src={img1} alt='featureImg' height={77} width={222} 
            className='rounded-full'/>
          </div>
          <div>
            <img src={img2} alt='featureImg' height={77} width={222} 
            className='rounded-full'/>
          </div>
        </div>
        <div className='flexCenter flex-wrap sm:flex-nowrap gap-x-5'>
          <div className='p-4 rounded-3xl'>
            <h4 className='h4 capitalize'>Produk Berkualitas</h4>
            <p>Setiap produk yang kami tawarkan berkualitas. Kualitas menjadi komitmen utama kami</p>
          </div>
          <div className='p-4 rounded-3xl'>
            <h4 className='h4 capitalize'>Beragam Pilihan Produk</h4>
            <p>Temukan koleksi pakaian untuk segala kebutuhan. emua tersedia dalam satu platform yang nyaman dan mudah digunakan.</p>
          </div>
          <div className='p-4 rounded-3xl'>
            <h4 className='h4 capitalize'>Dukung Fashion Lokal</h4>
            <p>Anda turut mendukung pertumbuhan industri fashion dalam negeri dan memberdayakan para pelaku UMKM lokal.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
