const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="page py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
        <p className="text-[13px] text-ink-2">Copyright &copy; {currentYear} MyBabyCare</p>
        <p className="text-xs text-ink-3">Version {__APP_VERSION__}</p>
      </div>
    </footer>
  );
};

export default Footer;
