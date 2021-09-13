import React from "react"
import spinner from './spinner.svg'

type LoaderType = {
    classes?: string
}

export const Loader: React.FC<LoaderType> = ({classes}) => {
    return (
        <div className='d-flex justify-content-center' >
            <img src={spinner} alt='Loading...'/>
        </div>
    )
}