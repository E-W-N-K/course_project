import type { ReactNode } from "react";
import styles from "./UITable.module.css";

export interface UITableColumn<T> {
	key: string;
	header: string;
	render?: (item: T) => ReactNode;
}

interface UITableProps<T> {
	columns: UITableColumn<T>[];
	data: T[];
	className?: string;
}

export const UITable = <T extends Record<string, any>>({
	columns,
	data,
	className = "",
}: UITableProps<T>) => {
	return (
		<div className={`${styles["table-wrapper"]} ${className}`}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						{columns.map((column) => (
							<th key={column.key} className={styles.th}>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={styles.tbody}>
					{data.length === 0 ? (
						<tr className={styles.tr}>
							<td
								colSpan={columns.length}
								className={`${styles.td} ${styles["td--empty"]}`}
							>
								No data available
							</td>
						</tr>
					) : (
						data.map((item, index) => (
							<tr key={index} className={styles.tr}>
								{columns.map((column) => (
									<td key={column.key} className={styles.td}>
										{column.render
											? column.render(item)
											: (item[column.key] as ReactNode)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};
