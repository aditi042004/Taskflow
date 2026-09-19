function Footer({ visibleCount, totalCount }) {
  return (
    <footer className="footer">
      <p className="footer-count">
        Showing {visibleCount} of {totalCount} task{totalCount !== 1 ? 's' : ''}
      </p>
      <p className="footer-credit">
        Built with <span>React</span> + <span>Vite</span>
      </p>
    </footer>
  );
}

export default Footer;
