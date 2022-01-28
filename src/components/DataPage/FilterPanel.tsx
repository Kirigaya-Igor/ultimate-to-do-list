import React, {FC} from "react"

type FilterPanelType = {
    searchText: string
    setSearchText: (value: string) => void
}

export const FilterPanel: FC<FilterPanelType> = ({searchText, setSearchText}) => {

    return (
        <div className='col-md-8 d-flex justify-content-between searchPanel'>
            <div className='col-4 d-flex align-items-end'>
                <input value={searchText} className='searchInput' type='text' placeholder='Search'
                       onChange={(e) => {
                           setSearchText(e.target.value)
                       }}
                />
            </div>
        </div>
    )
}