'use client';

export default function DashboardHeader({ title, subtitle, actions }) {
	return (
		<div className="dashboard-header-new">
			<div className="header-text">
				<h1 className="dashboard-title-new">{title}</h1>
				{subtitle && <p className="dashboard-subtitle-new">{subtitle}</p>}
			</div>
			{actions && (
				<div className="header-actions">
					{actions}
				</div>
			)}
		</div>
	);
}
