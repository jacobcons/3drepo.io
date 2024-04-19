/**
 *  Copyright (C) 2024 3D Repo Ltd
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
	className?: any;
};

export default ({ className }: IProps) => (
	<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<g id="transform-reset-o">
			<path
				className="primary"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M520.167 250.208C510.705 246.003 499.906 246.004 490.444 250.208L267.324 349.347C254.105 355.221 245.586 368.329 245.586 382.794V655.38C245.586 669.847 254.107 682.954 267.324 688.827L490.444 787.966C499.906 792.17 510.705 792.171 520.167 787.966L743.287 688.827C756.506 682.954 765.026 669.846 765.026 655.38V382.794C765.026 368.327 756.505 355.22 743.287 349.347L520.167 250.208ZM370.153 382.445L505.306 322.392L640.461 382.445L505.308 442.485L370.153 382.445ZM317.586 437.877V632.372L469.308 699.787V505.277L317.586 437.877ZM541.308 699.786L693.026 632.372V437.879L541.308 505.277V699.786Z"
				fill="currentColor"
			/>
			<path
				className="primary"
				d="M173.322 231.301L241.971 231.204C261.853 231.176 277.994 247.271 278.022 267.153C278.05 287.035 261.955 303.176 242.073 303.204L92.6566 303.415C83.0911 303.429 73.9136 299.635 67.1498 292.871C60.386 286.107 56.5921 276.93 56.6057 267.364L56.817 117.948C56.8451 98.0654 72.9856 81.9705 92.8678 81.9986C112.75 82.0267 128.845 98.1673 128.817 118.05L128.74 172.507C184.824 109.195 256.179 60.2536 336.883 30.879C457.325 -12.9594 589.828 -10.0297 708.214 39.0893C826.601 88.2083 922.258 179.944 976.288 296.171C1030.32 412.398 1038.79 544.663 1000.03 666.834C961.268 789.004 878.096 892.193 766.943 956.014C655.791 1019.84 524.744 1039.65 399.693 1011.53C274.643 983.416 164.686 909.422 91.5464 804.167C25.2876 708.814 -6.38907 594.09 1.0703 478.922C2.3575 459.049 20.6629 445.223 40.3967 447.905C60.1305 450.587 73.7974 468.767 72.7399 488.654C67.5693 585.891 94.818 682.492 150.771 763.013C213.608 853.442 308.077 917.013 415.513 941.168C522.949 965.322 635.537 948.303 731.033 893.471C826.528 838.64 897.986 749.986 931.286 645.024C964.587 540.062 957.309 426.428 910.889 326.572C864.47 226.717 782.287 147.903 680.576 105.703C578.866 63.5024 465.026 60.9853 361.55 98.6487C287.619 125.558 222.821 171.579 173.322 231.301Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);
