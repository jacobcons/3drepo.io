/**
 *  Copyright (C) 2022 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

type IProps = {
	className?: string,
};

export default ({ className }: IProps) => (
	<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<path d="M8.99621 3.4032C9.18814 3.59568 9.49978 3.59612 9.69226 3.40419C9.88475 3.21225 9.88519 2.90061 9.69325 2.70813L7.23926 0.24719C7.14692 0.154586 7.02152 0.102539 6.89074 0.102539C6.75996 0.102539 6.63456 0.154586 6.54222 0.24719L6.40016 0.389649H6.37793V0.411945L4.08823 2.70813C3.8963 2.90061 3.89674 3.21225 4.08922 3.40419C4.2817 3.59612 4.59334 3.59568 4.78528 3.4032L6.37793 1.80604V6.53516H1.66213L3.30066 4.90126C3.49314 4.70932 3.49359 4.39768 3.30165 4.2052C3.10971 4.01271 2.79807 4.01227 2.60559 4.20421L0.144651 6.6582C0.0520466 6.75054 0 6.87594 0 7.00672C0 7.1375 0.0520466 7.2629 0.144651 7.35524L0.287109 7.4973V7.51953H0.309407L2.60559 9.80923C2.79807 10.0012 3.10971 10.0007 3.30165 9.80824C3.49359 9.61576 3.49314 9.30412 3.30066 9.11218L1.7035 7.51953H6.37793V12.3948L4.78455 10.8014C4.59234 10.6092 4.28071 10.6092 4.08849 10.8014C3.89628 10.9936 3.89628 11.3052 4.08849 11.4974L6.54943 13.9584C6.64174 14.0507 6.76692 14.1025 6.89746 14.1025C7.028 14.1025 7.15319 14.0507 7.24549 13.9584L9.70643 11.4974C9.89864 11.3052 9.89864 10.9936 9.70643 10.8014C9.51422 10.6092 9.20258 10.6092 9.01037 10.8014L7.3623 12.4495V7.51953H12.2922L10.6988 9.11291C10.5066 9.30512 10.5066 9.61676 10.6988 9.80897C10.8911 10.0012 11.2027 10.0012 11.3949 9.80897L13.8558 7.34803C13.9481 7.25573 14 7.13054 14 7C14 6.86946 13.9481 6.74427 13.8558 6.65197L11.3949 4.19103C11.2027 3.99882 10.8911 3.99882 10.6988 4.19103C10.5066 4.38324 10.5066 4.69488 10.6988 4.88709L12.3469 6.53516H7.3623V1.76467L8.99621 3.4032Z" fill="currentColor"/>
	</svg>
);