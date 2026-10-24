// App mark: the Sudan flag map pin. Same image as the favicon (public/favicon.png).
export default function Logo({ size = 34 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}favicon.png`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className="logo"
    />
  )
}
