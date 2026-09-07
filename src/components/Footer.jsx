const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="page py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
        <p className="text-[13px] text-ink-2">
          Copyright &copy; {currentYear} — Developed by{' '}
          <a href="http://matrixlab.it.com/" target="_blank" rel="noopener noreferrer" className="font-semibold">
            MatrixLab
          </a>
        </p>
        <p className="text-xs text-ink-3">Version 1.4.0</p>
      </div>
    </footer>
  );
};

export default Footer;
