export default function SocialLogin() {
  const socialButtons = ["github", "google", "apple"];
  return (
    <div className="my-2 space-y-2">
      {socialButtons.map((item) => (
        <button
          key={item}
          className="w-full text-slate-700 border py-1.5 px-6 focus:outline-none hover:bg-slate-100  cursor-pointer"
          type="button"
        >
          Login with <span className="capitalize">{item}</span>
        </button>
      ))}
    </div>
  );
}
