import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectUpdate } from '../hooks/useEffectUpdate'
import { userService } from '../services/user.service'
import { toggleBookmark } from '../store/user.actions'
import { TermDefSections } from './TermDefSections'
import { TermHeader } from './TermHeader'

export const DefinitionCard = ({ term }) => {
  const isBookmarked = useSelector(({ user }) => {
    console.log('fafa', user)
    if (!term) return
    return user?.bookmarks?.some(({ id }) => id === term.id)
  })
  const dispatch = useDispatch()

  const handleBookmark = () => {
    console.log('hey')
    dispatch(toggleBookmark(term))
  }

  if (!term) return <div>Loading term...</div>
  return (
    <article className="card definition-card">
      {isBookmarked === null || (
        <span
          className={`material-symbols-outlined bookmark-icon ${
            !isBookmarked && 'no-fill'
          }`}
          onClick={handleBookmark}>
          bookmark
        </span>
      )}
      <TermHeader term={term} />
      <TermDefSections term={term} />
    </article>
  )
}
