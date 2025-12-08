 import React from 'react'
 
 const Ingrediente = (urlImg,name) => {
   return (
     <div className=''>
       <img src={urlImg}/>
       <span>{name}</span>
     </div>
   )
 }
 
 export default Ingrediente
 