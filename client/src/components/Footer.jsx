import './Footer.scss';

function Footer() {
	return (
		<div className="footer" id="about">
			<div className="container">
				<hr />
				<div className="bottom">
					<div className="left">
						<h2>doWork</h2>
						<span>© doWork 2024</span>
					</div>
					<div className="right">
						<div className="social">
							<img src="/img/twitter.png" alt="" />
							<img src="/img/facebook.png" alt="" />
							<img src="/img/linkedin.png" alt="" />
							<img src="/img/pinterest.png" alt="" />
							<img src="/img/instagram.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
