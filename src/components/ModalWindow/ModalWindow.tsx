import React, {FC} from "react";
import './modalWindow.scss'

type ModalWindowType = {
    isActive: boolean
}

export const ModalWindow: FC<ModalWindowType> = ({children, isActive}) => {
    return (
        <div className={`modalWindow ${isActive ? 'active' : ''}`}>
            <div className='container-fluid'>
                <div className='row d-flex justify-content-center'>
                    <div className='modalContent col-md-4 col-xl-5'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}