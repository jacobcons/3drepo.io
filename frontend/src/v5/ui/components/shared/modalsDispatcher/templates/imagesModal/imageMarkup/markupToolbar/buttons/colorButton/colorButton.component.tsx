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

import { ColorIcon, PickerContainer } from './colorButton.styles';
import { ClickAwayListener, ThemeProvider } from '@mui/material';
import { formatMessage } from '@/v5/services/intl';
import { ToolbarButton } from '../../toolbarButton/toolbarButton.component';
import { ButtonOptionsContainer } from '../buttons.styles';
import { ColorPickerPalette } from '@controls/inputs/colorPicker/colorPickerPalette/colorPickerPalette.component';
import { theme } from '@/v5/ui/routes/viewer/theme';
import { decimalToHex, hexToDecimal } from '@controls/inputs/colorPicker/colorPicker.helpers';
import { useState } from 'react';
import { FloatingButtonsContainer } from '../../toolbarButton/multioptionIcons.styles';

type ColorButtonProps = {
	onChange: (value: string) => void;
	value: string;
};
export const ColorButton = ({ value, onChange }: ColorButtonProps) => {
	const [expanded, setExpanded] = useState(false);

	const getColorAndOpacity = () => {
		const color = value.slice(0, 7);
		const opacity = hexToDecimal(value.slice(-2)) / 255;
		return { color, opacity };
	};
	const handleChange = ({ color, opacity }) => {
		setExpanded(false);
		onChange(color + decimalToHex(Math.round(opacity * 255)));
	};

	const handleKeyDown = (e) => {
		if (e.keyCode === 8) {
			e.stopPropagation();
		}
	};

	return (
		<ClickAwayListener onClickAway={() => setExpanded(false)}>
			<ButtonOptionsContainer>
				<FloatingButtonsContainer>
					{expanded && (
						<PickerContainer onKeyDown={handleKeyDown}>
							<ThemeProvider theme={theme}>
								<ColorPickerPalette
									value={getColorAndOpacity()}
									onChange={handleChange}
									onClose={() => setExpanded(false)}
									disableTransparent
								/>
							</ThemeProvider>
						</PickerContainer>
					)}
				</FloatingButtonsContainer>
				<ToolbarButton
					title={formatMessage({ id: 'imageMarkup.icon.title.color', defaultMessage: 'color' })}
					Icon={() => (<ColorIcon color={value} />)}
					onClick={() => setExpanded(!expanded)}
				/>
			</ButtonOptionsContainer>
		</ClickAwayListener>
	);
};
