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
	<svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 16 14" fill="none" className={className}>
		<path
			d="M15.1434 1.2868H4.71481C4.63624 1.2868 4.57196 1.35109 4.57196 1.42966V2.42966C4.57196 2.50823 4.63624 2.57251 4.71481 2.57251H15.1434C15.222 2.57251 15.2862 2.50823 15.2862 2.42966V1.42966C15.2862 1.35109 15.222 1.2868 15.1434 1.2868ZM15.1434 6.35823H4.71481C4.63624 6.35823 4.57196 6.42251 4.57196 6.50109V7.50109C4.57196 7.57966 4.63624 7.64394 4.71481 7.64394H15.1434C15.222 7.64394 15.2862 7.57966 15.2862 7.50109V6.50109C15.2862 6.42251 15.222 6.35823 15.1434 6.35823ZM15.1434 11.4297H4.71481C4.63624 11.4297 4.57196 11.4939 4.57196 11.5725V12.5725C4.57196 12.6511 4.63624 12.7154 4.71481 12.7154H15.1434C15.222 12.7154 15.2862 12.6511 15.2862 12.5725V11.5725C15.2862 11.4939 15.222 11.4297 15.1434 11.4297ZM0.714813 1.92966C0.714813 2.06098 0.740679 2.19101 0.790934 2.31234C0.841188 2.43367 0.914848 2.54391 1.00771 2.63676C1.10057 2.72962 1.2108 2.80328 1.33213 2.85354C1.45346 2.90379 1.58349 2.92966 1.71481 2.92966C1.84614 2.92966 1.97617 2.90379 2.0975 2.85354C2.21882 2.80328 2.32906 2.72962 2.42192 2.63676C2.51478 2.54391 2.58844 2.43367 2.63869 2.31234C2.68895 2.19101 2.71481 2.06098 2.71481 1.92966C2.71481 1.79834 2.68895 1.6683 2.63869 1.54697C2.58844 1.42565 2.51478 1.31541 2.42192 1.22255C2.32906 1.12969 2.21882 1.05603 2.0975 1.00578C1.97617 0.955523 1.84614 0.929657 1.71481 0.929657C1.58349 0.929657 1.45346 0.955523 1.33213 1.00578C1.2108 1.05603 1.10057 1.12969 1.00771 1.22255C0.914848 1.31541 0.841188 1.42565 0.790934 1.54697C0.740679 1.6683 0.714813 1.79834 0.714813 1.92966ZM0.714813 7.00109C0.714813 7.13241 0.740679 7.26244 0.790934 7.38377C0.841188 7.5051 0.914848 7.61533 1.00771 7.70819C1.10057 7.80105 1.2108 7.87471 1.33213 7.92497C1.45346 7.97522 1.58349 8.00109 1.71481 8.00109C1.84614 8.00109 1.97617 7.97522 2.0975 7.92497C2.21882 7.87471 2.32906 7.80105 2.42192 7.70819C2.51478 7.61533 2.58844 7.5051 2.63869 7.38377C2.68895 7.26244 2.71481 7.13241 2.71481 7.00109C2.71481 6.86976 2.68895 6.73973 2.63869 6.6184C2.58844 6.49708 2.51478 6.38684 2.42192 6.29398C2.32906 6.20112 2.21882 6.12746 2.0975 6.07721C1.97617 6.02695 1.84614 6.00109 1.71481 6.00109C1.58349 6.00109 1.45346 6.02695 1.33213 6.07721C1.2108 6.12746 1.10057 6.20112 1.00771 6.29398C0.914848 6.38684 0.841188 6.49708 0.790934 6.6184C0.740679 6.73973 0.714813 6.86976 0.714813 7.00109ZM0.714813 12.0725C0.714813 12.2038 0.740679 12.3339 0.790934 12.4552C0.841188 12.5765 0.914848 12.6868 1.00771 12.7796C1.10057 12.8725 1.2108 12.9461 1.33213 12.9964C1.45346 13.0466 1.58349 13.0725 1.71481 13.0725C1.84614 13.0725 1.97617 13.0466 2.0975 12.9964C2.21882 12.9461 2.32906 12.8725 2.42192 12.7796C2.51478 12.6868 2.58844 12.5765 2.63869 12.4552C2.68895 12.3339 2.71481 12.2038 2.71481 12.0725C2.71481 11.9412 2.68895 11.8112 2.63869 11.6898C2.58844 11.5685 2.51478 11.4583 2.42192 11.3654C2.32906 11.2726 2.21882 11.1989 2.0975 11.1486C1.97617 11.0984 1.84614 11.0725 1.71481 11.0725C1.58349 11.0725 1.45346 11.0984 1.33213 11.1486C1.2108 11.1989 1.10057 11.2726 1.00771 11.3654C0.914848 11.4583 0.841188 11.5685 0.790934 11.6898C0.740679 11.8112 0.714813 11.9412 0.714813 12.0725Z"
			fill="currentColor"
		/>
	</svg>
);
