const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Copyright © {currentYear} - Developed by{' '}
            <a
              href="http://matrixlab.it.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
            >
              MatrixLab
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Version 1.2.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
