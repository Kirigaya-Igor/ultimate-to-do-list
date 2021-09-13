import React from "react"
import './textError.scss'

const TextError: React.FC = (props)=> {
    return <div className='d-flex justify-content-start textError'>{props.children}</div>
}

export default TextError