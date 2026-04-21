import { memo } from "react"
type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const AppLogo = memo(({ className, ...props }: SvgProps) => {
  return (
        <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none">
          <circle cx="8" cy="8" r="3" fill="#7F77DD" />
          <circle cx="8" cy="8" r="6.5" stroke="#7F77DD" strokeWidth="1" />
          <path d="M8 3 Q11 5.5 8 8 Q5 10.5 8 13" stroke="#7F77DD" strokeWidth="1" fill="none" />
        </svg>
  )
})