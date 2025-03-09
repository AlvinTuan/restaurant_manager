import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  pageSize: number
  pathname?: string
  isLink?: boolean
  onClick?: (pageNumber: number) => void
}

const RANGE = 2

export default function AutoPagination({ page, pageSize, pathname = '/', isLink = true, onClick = () => {} }: Props) {
  const renderPagination = () => {
    let dotBefore = false
    let dotAfter = false

    return Array.from({ length: pageSize }, (_, index) => {
      const pageNumber = index + 1

      if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
        if (!dotAfter) {
          dotAfter = true
          return (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
        return null
      }

      if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          if (!dotBefore) {
            dotBefore = true
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          return null
        }
        if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          if (!dotAfter) {
            dotAfter = true
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          return null
        }
      }

      if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        if (!dotBefore) {
          dotBefore = true
          return (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
        return null
      }

      return (
        <PaginationItem key={index}>
          {isLink ? (
            <PaginationLink href={`${pathname}?page=${pageNumber}`} isActive={pageNumber === page}>
              {pageNumber}
            </PaginationLink>
          ) : (
            <Button
              onClick={() => onClick(pageNumber)}
              variant={pageNumber === page ? 'outline' : 'ghost'}
              className='p-0 w-9 h-9'
            >
              {pageNumber}
            </Button>
          )}
        </PaginationItem>
      )
    })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <PaginationPrevious
              href={`${pathname}?page=${page - 1}`}
              className={cn({ 'cursor-not-allowed': page === 1 })}
              onClick={(e) => page === 1 && e.preventDefault()}
            />
          ) : (
            <Button disabled={page === 1} className='p-0 px-2 h-9' variant='ghost' onClick={() => onClick(page - 1)}>
              <ChevronLeft className='w-5 h-5' /> Previous
            </Button>
          )}
        </PaginationItem>
        {renderPagination()}
        <PaginationItem>
          {isLink ? (
            <PaginationNext
              href={`${pathname}?page=${page + 1}`}
              className={cn({ 'cursor-not-allowed': page === pageSize })}
              onClick={(e) => page === pageSize && e.preventDefault()}
            />
          ) : (
            <Button
              disabled={page === pageSize}
              className='p-0 px-2 h-9'
              variant='ghost'
              onClick={() => onClick(page + 1)}
            >
              Next <ChevronRight className='w-5 h-5' />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
