import './SpinnerButton.css'
import spinnerSrc from '../../../assets/spinner.gif'

interface SpinnerButtonProps {
    isSpinning: boolean
    buttonText: string
    spinningText: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}
export default function SpinnerButton(props: SpinnerButtonProps) {

    const { isSpinning, buttonText, spinningText, onClick, className} = props

    return (
        <div className={`SpinnerButtton ${className || ''}`}>
            {isSpinning && <span>{spinningText} <i><img src={spinnerSrc} /></i></span>}
            {!isSpinning && <button onClick={onClick} className={className}>{buttonText}</button>}
        </div>
    )
}