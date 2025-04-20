import React from 'react'
import size from '../assets/sizeguide.png'

const ProductDescription = () => {
  return (
    <div className='ring-1 ring-slate-900/10 rounded-lg'>
      <div className='flex gap-3'>
        <button className='medium-14 p-3 w-32 border-b-2 border-secondary'>Size Guide</button>
      </div>
      <hr className='h-[1px] w-full' />
      <div className='flex flex-col gap-3 p-3'>
        <div>
          <h5 className='h5'>Detail</h5>
          <img src={size} alt='Size Guide' className='max-w-xs w-full h-auto' />
        </div>
        <div>
          <h5 className='h5'>Tips Memilih Ukuran</h5>
          <ul className='list-disc pl-5 text-sm text-gray-30 flex flex-col gap-1'>
            <li>Jika berada di antara dua ukuran, disarankan memilih yang lebih besar.</li>
            <li>Ukuran bisa sedikit berbeda tergantung bahan dan potongan pakaian.</li>
            <li>Untuk hasil terbaik, ukur badan langsung menggunakan pita ukur.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
