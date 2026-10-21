Aboensis is a package that contains the free OpenType/PS paleographic
font Aboensis and a style file for using it with XeLaTeX.

The typeface is a cursive book hand based on Codex Aboensis that it a
medieval book of laws written in Sweden during the 1430s. Since all
relevant characters do not occur in the text, some other roughly
contemporary sources were also consulted. The most important of those
was the cartulary Register Ecclesia Aboensis that was started in the
1480s.

This font is intended mainly for emulating medieval manuscripts and
has secondary use as a display font. Because medieval cursive is very
difficult to understand for modern readers, aboensis is not suitable
for general purpose use. 

The font has a large number of symbols that were in use in the 15th
century but fell out of use during the early modern period. These
symbols can be accessed either using ligature substitutions ar by
enabling suitable OpenType features. The general approach is that
abbreviation substitutions are written inside brackets. For example,
'[per]' enters a 'p' that has a strike going through its tail. The
font has also features that allow highlighting capital characters with
drawing different colored strikes over them. This highlighting is
controlled with OpenType Features that are described in the
documentation.

The main problem with typsetting cursive using XeLaTeX is that long
ascenders and descenders cause uneven line distance. The style file
aboensis.sty contains helper macros that let ascenders and descenders
oerlap with each other. 

This font is distributed under the SIL Open Font License. The
documentation TeX file is distributed under the Latex Project Public
License (LPPL) version 1.3c or later. The digitized manuscript images
in the documentation are distributed either under Creative Commons
Attribution 4.0 International (CC BY 4.0) or are Public Domain. The
license and attribution of each individual image is specified in
aboensis.pdf.
