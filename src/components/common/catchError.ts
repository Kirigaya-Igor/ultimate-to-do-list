export const catchError = (error: any, showAlert: (text: string, success?: boolean) => void) => {
    if (error.response) {
        showAlert(error.response.data.data[0].messages[0].message)
    } else if (error.request) {
        showAlert(`Some client error has occurred, please try again. Error message: ${error.message}`)
    } else {
        showAlert('Some error has occurred, please try again.')
    }
}