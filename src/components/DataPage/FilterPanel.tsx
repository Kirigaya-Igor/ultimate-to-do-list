import React, {FC} from "react"

type FilterPanelType = {
    sortType: string
    setSortType: (value: string) => void
    setActivePage: (value: boolean) => void
    setIsLoading: (value: boolean) => void
    searchText: string
    setSearchText: (value: string) => void
}

export const FilterPanel: FC<FilterPanelType> = ({
                                                     sortType, setSortType, setActivePage,
                                                     setIsLoading, searchText, setSearchText
                                                 }) => {

    return (
        <div className='col-md-8 d-flex justify-content-between searchPanel'>
            <div className='col-4 d-flex align-items-end'>
                <input value={searchText} className='searchInput' type='text' placeholder='Search'
                       onChange={(e) => {
                           setSearchText(e.target.value)
                       }}
                />
            </div>
            <div className="dropdown col-3 d-flex justify-content-end">
                <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton2"
                        data-bs-toggle="dropdown" aria-expanded="false">
                    Sort by: {sortType === 'created_at' ? 'date' : sortType}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                    <li>
                        <button className="dropdown-item" type="button"
                                onClick={() => {
                                    setSortType('created_at')
                                    setActivePage(true)
                                    setIsLoading(true)
                                    setSearchText('')
                                }}
                        >Date</button>
                    </li>
                    <li>
                        <button className="dropdown-item" type="button"
                                onClick={() => {
                                    setSortType('name')
                                    setActivePage(true)
                                    setIsLoading(true)
                                    setSearchText('')
                                }}
                        >Name</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}