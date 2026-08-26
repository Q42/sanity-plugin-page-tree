import { EditIcon } from '@sanity/icons/Edit';
import { PublishIcon } from '@sanity/icons/Publish';
import { Box, Flex, Text, useTheme } from '@sanity/ui';
import { Tooltip, TooltipProps } from '@sanity/ui/tooltip';
import styled from 'styled-components';

export type PageTreeViewItemStatusProps = {
  isPublished: boolean;
  isDraft: boolean;
};

const TOOLTIP_PROPS: Partial<TooltipProps> = {
  fallbackPlacements: ['right', 'left'],
  placement: 'top',
  portal: true,
};

export const PageTreeViewItemStatus = ({ isPublished, isDraft }: PageTreeViewItemStatusProps) => {
  const theme = useTheme();

  return (
    <Flex gap={2} style={{ flexShrink: 0 }}>
      <Tooltip
        content={
          <Box padding={2}>
            <Text muted size={1}>
              {isPublished ? 'Published' : 'Not published'}
            </Text>
          </Box>
        }
        {...TOOLTIP_PROPS}>
        <OpacityBox $opacity={isPublished ? 1 : 0.3}>
          <PublishIcon fontSize={21} color={isPublished ? theme.sanity.color.muted.positive.enabled.fg : undefined} />
        </OpacityBox>
      </Tooltip>
      <Tooltip
        content={
          <Box padding={2}>
            <Text muted size={1}>
              {isDraft ? 'Edited' : 'No unpublished edits'}
            </Text>
          </Box>
        }
        {...TOOLTIP_PROPS}>
        <OpacityBox $opacity={isDraft ? 1 : 0.3}>
          <EditIcon fontSize={21} color={isDraft ? theme.sanity.color.muted.caution.enabled.fg : undefined} />
        </OpacityBox>
      </Tooltip>
    </Flex>
  );
};

const OpacityBox = styled(Box)<{ $opacity: number }>`
  opacity: ${props => props.$opacity};
`;
